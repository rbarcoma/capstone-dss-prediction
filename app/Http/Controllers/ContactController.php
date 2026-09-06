<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ContactController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'min:3', 'max:150', 'not_regex:/[\r\n]/'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->filled('website')) {
            return back()->with('success', 'Message sent successfully.');
        }

        $mailSubject = 'DSS Energy inquiry: '.Str::limit(
            Str::squish($data['subject']),
            120,
            '',
        );

        try {
            Mail::raw(
                "Name: {$data['name']}\nEmail: {$data['email']}\nSubject: {$data['subject']}\n\nMessage:\n{$data['message']}",
                function (Message $message) use ($data, $mailSubject) {
                    $message
                        ->to('dsspredictionqc@gmail.com')
                        ->replyTo($data['email'], $data['name'])
                        ->subject($mailSubject);
                },
            );
        } catch (Throwable $exception) {
            Log::warning('Contact inquiry could not be delivered.', [
                'exception_class' => $exception::class,
            ]);

            return back()
                ->withInput($request->except('website'))
                ->with('error', 'We could not send your inquiry right now. Please try again or email the project team directly.');
        }

        return back()->with('success', 'Message sent successfully.');
    }
}
